

export function buildPairIndex(poolsMeta) {
    const map = new Map();
    for (const p of poolsMeta) {
      const a = p.token0.address.toLowerCase();
      const b = p.token1.address.toLowerCase();
      const entry = { address: p.address, fee: p.fee }; // Store fee
      map.set(`${a}_${b}`, entry);
      map.set(`${b}_${a}`, entry);
    }
    return map;
  }
export function findBestPath(pairIndex, addrA, addrB) {
  if (!addrA || !addrB || !pairIndex) return null;

  const a = addrA.toLowerCase();
  const b = addrB.toLowerCase();

  // 1. Direct
  const direct = pairIndex.get(`${a}_${b}`);
  if (direct) {
    return {
      path: [a, b],
      pools: [direct.address],
      fees: [direct.fee]
    };
  }

  // neighbors of A
  const neighborsA = [];

  for (const [key, val] of pairIndex.entries()) {
    const [t0, t1] = key.split("_");

    if (t0 === a) neighborsA.push({ next: t1, pool: val.address, fee: val.fee });
    else if (t1 === a) neighborsA.push({ next: t0, pool: val.address, fee: val.fee });
  }

  // 2-hop
  for (const edge of neighborsA) {
    const second = pairIndex.get(`${edge.next}_${b}`);
    if (second) {
      return {
        path: [a, edge.next, b],
        pools: [edge.pool, second.address],
        fees: [edge.fee, second.fee]
      };
    }
  }

  // 3-hop
  for (const edge1 of neighborsA) {
    const mid1 = edge1.next;

    for (const [key, val] of pairIndex.entries()) {
      const [t0, t1] = key.split("_");

      let mid2 = null;
      let fee2 = null;
      let pool2 = null;

      if (t0 === mid1 && t1 !== a) {
        mid2 = t1;
        fee2 = val.fee;
        pool2 = val.address;
      } else if (t1 === mid1 && t0 !== a) {
        mid2 = t0;
        fee2 = val.fee;
        pool2 = val.address;
      }

      if (mid2) {
        const third = pairIndex.get(`${mid2}_${b}`);
        if (third) {
          return {
            path: [a, mid1, mid2, b],
            pools: [edge1.pool, pool2, third.address],
            fees: [edge1.fee, fee2, third.fee]
          };
        }
      }
    }
  }

  return null;
}