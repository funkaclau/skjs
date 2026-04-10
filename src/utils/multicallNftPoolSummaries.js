import { MULTICALL } from "../config";

const MULTICALL_ADDRESS = "0x49Bb5bfAAAe05e44d4922F236304b2e370DaF442";

const POOL_META_ABI = [
  {
    name: "getPoolMetadata",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { type: "string", name: "name" },
      { type: "string", name: "projectName" },
      { type: "string", name: "metadataUri" },
      { type: "address", name: "owner_" },
      { type: "address", name: "token" },
      { type: "address", name: "nftAddress" },
      { type: "uint256", name: "cap" },
      { type: "uint256", name: "perUserCap" },
      { type: "uint64", name: "startTime_" },
      {
        type: "tuple",
        name: "params",
        components: [
          { type: "uint96", name: "rewardRate" },
          { type: "uint32", name: "lockPeriod" },
          { type: "uint64", name: "rewardEnd" },
        ],
      },
      { type: "bool", name: "isActive" },
      { type: "uint8", name: "mode_" },
    ],
  },
];

const FALLBACK_ABI = [
  { name: "mode", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { name: "startTime", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint64" }] },
  {
    name: "rewardParams",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        type: "tuple",
        components: [
          { type: "uint96", name: "rewardRate" },
          { type: "uint32", name: "lockPeriod" },
          { type: "uint64", name: "rewardEnd" },
        ],
      },
    ],
  },
];

const POOL_STATS_ABI = [
  {
    name: "currentEmission",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { type: "uint256", name: "poolPerSec" },
      { type: "uint256", name: "perUnitPerSec" },
      { type: "uint256", name: "poolPerDay" },
      { type: "uint256", name: "perUnitPerDay" },
    ],
  },
  { name: "totalUnits", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
];

const ERC20_MIN_ABI = [
  { name: "decimals", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { name: "symbol", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { name: "name", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
];

const ZERO = "0x0000000000000000000000000000000000000000";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function nowSec() {
  return Math.floor(Date.now() / 1000);
}

function toBig(x) {
  try {
    return BigInt(String(x ?? "0"));
  } catch {
    return 0n;
  }
}

function deriveStatus(start, end, isActive) {
  const now = nowSec();
  const st = Number(start || 0);
  const en = Number(end || 0);

  if (isActive) return "active";
  if (!st && !en) return "to-setup";
  if (st && now < st) return "upcoming";
  if (en && now > en) return "ended";
  if (st && now >= st) return en ? "active" : "ended";
  if (!st && en) return now > en ? "ended" : "active";
  return "to-setup";
}

function summarizePoolRow(addr, row) {
  const {
    mode = 0,
    nft = ZERO,
    rewardToken = ZERO,
    rewardTokenMeta = { symbol: "", name: "", decimals: 18 },
    rewardRate = "0",
    perUnitPerSec = "0",
    poolPerSec = "0",
    poolPerDay = "0",
    perUnitPerDay = "0",
    totalUnits = "0",
    lockPeriod = "0",
    startTime = 0,
    rewardEnd = "0",
    poolName = "",
    project = "",
    uri = "",
    isActive = false,
  } = row;

  const status = deriveStatus(startTime, rewardEnd, isActive);

  return {
    address: addr,
    mode,
    nft,
    rewardToken,
    rewardTokenMeta,
    rewardRate,
    perUnitPerSec,
    perUnitPerDay,
    poolPerSec,
    poolPerDay,
    totalUnits,
    lockPeriod,
    startTime: String(startTime),
    endTime: String(rewardEnd),
    poolName,
    project,
    uri,
    status,
    displayName: poolName || project || "",
  };
}

/**
 * Batch-read NFT staking pool card summaries via Multicall3 — fewer HTTP round-trips than per-pool eth_calls.
 * Tune `poolsPerWave` / `pauseMs` if the public RPC 503s (smaller batches + longer pause).
 *
 * @param {import("web3").default} web3
 * @param {string[]} poolAddresses
 * @param {{ poolsPerWave?: number, pauseMs?: number, maxCallsPerAggregate?: number }} [opts]
 */
export async function readNftPoolSummariesMulticall(web3, poolAddresses, opts = {}) {
  const poolsPerWave = opts.poolsPerWave ?? 10;
  const pauseMs = opts.pauseMs ?? 100;
  const maxCallsPerAggregate = opts.maxCallsPerAggregate ?? 90;

  const valid = (poolAddresses || [])
    .filter((a) => a && typeof a === "string" && web3.utils.isAddress(a))
    .map((a) => web3.utils.toChecksumAddress(a));

  if (valid.length === 0) return [];

  const multicall = new web3.eth.Contract(MULTICALL, MULTICALL_ADDRESS);
  const metaOut = POOL_META_ABI[0].outputs;
  const emOut = POOL_STATS_ABI[0].outputs;
  const allRows = [];

  for (let w = 0; w < valid.length; w += poolsPerWave) {
    const slice = valid.slice(w, w + poolsPerWave);

    // 1) getPoolMetadata per pool
    const metaCalls = slice.map((addr) => {
      const c = new web3.eth.Contract(POOL_META_ABI, addr);
      return { target: addr, allowFailure: true, callData: c.methods.getPoolMetadata().encodeABI() };
    });
    const metaRes = await multicall.methods.aggregate3(metaCalls).call();

    const byAddr = new Map();
    const needFallback = [];

    for (let i = 0; i < slice.length; i++) {
      const addr = slice[i];
      const r = metaRes[i];
      if (!r?.success || !r.returnData || r.returnData === "0x") {
        needFallback.push(addr);
        continue;
      }
      try {
        const m = web3.eth.abi.decodeParameters(metaOut, r.returnData);
        const name = m.name ?? m[0] ?? "";
        const project = m.projectName ?? m[1] ?? "";
        const uri = m.metadataUri ?? m[2] ?? "";
        const rewardToken = m.token ?? m[4] ?? ZERO;
        const nft = m.nftAddress ?? m[5] ?? ZERO;
        const startTime = Number(m.startTime_ ?? m[8] ?? 0);
        const p = m.params ?? m[9] ?? {};
        const rewardRate = String(p.rewardRate ?? p[0] ?? "0");
        const lockPeriod = String(p.lockPeriod ?? p[1] ?? "0");
        const rewardEnd = String(p.rewardEnd ?? p[2] ?? "0");
        const isActive = Boolean(m.isActive ?? m[10] ?? false);
        const mode = Number(m.mode_ ?? m[11] ?? 0);

        byAddr.set(addr.toLowerCase(), {
          addr,
          mode,
          nft,
          rewardToken,
          rewardRate,
          lockPeriod,
          rewardEnd,
          isActive,
          poolName: name,
          project,
          uri,
          startTime,
          metaOk: true,
        });
      } catch {
        needFallback.push(addr);
      }
    }

    // 2) Fallback: mode, startTime, rewardParams
    if (needFallback.length) {
      const fbCalls = [];
      for (const addr of needFallback) {
        const sf = new web3.eth.Contract(FALLBACK_ABI, addr);
        fbCalls.push({ target: addr, allowFailure: true, callData: sf.methods.mode().encodeABI() });
        fbCalls.push({ target: addr, allowFailure: true, callData: sf.methods.startTime().encodeABI() });
        fbCalls.push({ target: addr, allowFailure: true, callData: sf.methods.rewardParams().encodeABI() });
      }
      const fbRes = await multicall.methods.aggregate3(fbCalls).call();

      let j = 0;
      for (const addr of needFallback) {
        const modeR = fbRes[j++];
        const stR = fbRes[j++];
        const rpR = fbRes[j++];

        let mode = 0;
        let startTime = 0;
        let rewardRate = "0";
        let lockPeriod = "0";
        let rewardEnd = "0";
        try {
          if (modeR?.success && modeR.returnData)
            mode = Number(web3.eth.abi.decodeParameter("uint8", modeR.returnData));
          if (stR?.success && stR.returnData)
            startTime = Number(web3.eth.abi.decodeParameter("uint64", stR.returnData));
          if (rpR?.success && rpR.returnData) {
            const rp = web3.eth.abi.decodeParameters(FALLBACK_ABI[2].outputs, rpR.returnData);
            const tup = rp[0];
            rewardRate = String(tup?.rewardRate ?? tup?.[0] ?? "0");
            lockPeriod = String(tup?.lockPeriod ?? tup?.[1] ?? "0");
            rewardEnd = String(tup?.rewardEnd ?? tup?.[2] ?? "0");
          }
        } catch {}

        byAddr.set(addr.toLowerCase(), {
          addr,
          mode,
          nft: ZERO,
          rewardToken: ZERO,
          rewardRate,
          lockPeriod,
          rewardEnd,
          isActive: false,
          poolName: "",
          project: "",
          uri: "",
          startTime,
          metaOk: false,
        });
      }
    }

    // 3) ERC20 decimals/symbol/name for unique reward tokens
    const tokenSet = new Set();
    for (const row of byAddr.values()) {
      const t = String(row.rewardToken || "");
      if (web3.utils.isAddress(t) && t.toLowerCase() !== ZERO.toLowerCase()) {
        tokenSet.add(web3.utils.toChecksumAddress(t));
      }
    }
    const uniqueTokens = [...tokenSet];
    const tokenMetaByLower = new Map();

    for (let t0 = 0; t0 < uniqueTokens.length; t0 += Math.floor(maxCallsPerAggregate / 3)) {
      const tSlice = uniqueTokens.slice(t0, t0 + Math.floor(maxCallsPerAggregate / 3));
      const tCalls = [];
      for (const t of tSlice) {
        const rc = new web3.eth.Contract(ERC20_MIN_ABI, t);
        tCalls.push({ target: t, allowFailure: true, callData: rc.methods.decimals().encodeABI() });
        tCalls.push({ target: t, allowFailure: true, callData: rc.methods.symbol().encodeABI() });
        tCalls.push({ target: t, allowFailure: true, callData: rc.methods.name().encodeABI() });
      }
      if (tCalls.length) {
        const tr = await multicall.methods.aggregate3(tCalls).call();
        tSlice.forEach((t, idx) => {
          const d = tr[idx * 3];
          const sy = tr[idx * 3 + 1];
          const nm = tr[idx * 3 + 2];
          let decimals = 18;
          let symbol = "";
          let name = "";
          try {
            if (d?.success && d.returnData)
              decimals = Number(web3.eth.abi.decodeParameter("uint8", d.returnData));
          } catch {}
          try {
            if (sy?.success && sy.returnData)
              symbol = web3.eth.abi.decodeParameter("string", sy.returnData);
          } catch {}
          try {
            if (nm?.success && nm.returnData)
              name = web3.eth.abi.decodeParameter("string", nm.returnData);
          } catch {}
          tokenMetaByLower.set(t.toLowerCase(), { symbol: symbol || "", name: name || "", decimals });
        });
      }
      if (t0 + Math.floor(maxCallsPerAggregate / 3) < uniqueTokens.length) await sleep(pauseMs);
    }

    // 4) Pool stats: totalUnits + currentEmission per pool
    const statCalls = [];
    for (const addr of slice) {
      const es = new web3.eth.Contract(POOL_STATS_ABI, addr);
      statCalls.push({ target: addr, allowFailure: true, callData: es.methods.totalUnits().encodeABI() });
      statCalls.push({ target: addr, allowFailure: true, callData: es.methods.currentEmission().encodeABI() });
    }
    const statRes = await multicall.methods.aggregate3(statCalls).call();

    for (let i = 0; i < slice.length; i++) {
      const addr = slice[i];
      const row = byAddr.get(addr.toLowerCase());
      if (!row) continue;

      const totR = statRes[i * 2];
      const emR = statRes[i * 2 + 1];

      let totalUnits = "0";
      let poolPerSec = "0";
      let perUnitPerSec = row.rewardRate;
      let poolPerDay = "0";
      let perUnitPerDay = "0";

      try {
        if (totR?.success && totR.returnData)
          totalUnits = String(web3.eth.abi.decodeParameter("uint256", totR.returnData) ?? "0");
      } catch {}

      if (emR?.success && emR.returnData) {
        try {
          const em = web3.eth.abi.decodeParameters(emOut, emR.returnData);
          poolPerSec = String(em.poolPerSec ?? em[0] ?? "0");
          perUnitPerSec = String(em.perUnitPerSec ?? em[1] ?? row.rewardRate);
          poolPerDay = String(em.poolPerDay ?? em[2] ?? "0");
          perUnitPerDay = String(em.perUnitPerDay ?? em[3] ?? "0");
        } catch {}
      }

      if (!emR?.success || !emR.returnData) {
        const pps = toBig(row.rewardRate) * toBig(totalUnits);
        poolPerSec = pps.toString();
        perUnitPerDay = (toBig(row.rewardRate) * 86400n).toString();
        poolPerDay = (pps * 86400n).toString();
      }

      const rtKey = String(row.rewardToken || "").toLowerCase();
      const rt =
        rtKey && rtKey !== ZERO.toLowerCase()
          ? tokenMetaByLower.get(rtKey) ?? { symbol: "", name: "", decimals: 18 }
          : { symbol: "", name: "", decimals: 18 };

      allRows.push(
        summarizePoolRow(addr, {
          mode: row.mode,
          nft: row.nft,
          rewardToken: row.rewardToken,
          rewardTokenMeta: rt,
          rewardRate: row.rewardRate,
          perUnitPerSec,
          poolPerSec,
          poolPerDay,
          perUnitPerDay,
          totalUnits,
          lockPeriod: row.lockPeriod,
          startTime: row.startTime,
          rewardEnd: row.rewardEnd,
          poolName: row.poolName,
          project: row.project,
          uri: row.uri,
          isActive: row.isActive,
        })
      );
    }

    if (w + poolsPerWave < valid.length) await sleep(pauseMs);
  }

  return allRows;
}
