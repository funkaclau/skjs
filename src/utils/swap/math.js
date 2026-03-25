import {
  fromRaw
} from "../price";



export const pickMax = (s) => String(s || "").replace(/[^\d.]/g, "");

export const ratioOutPerInRaw = (rawOut, rawIn, decOut, decIn) => {
  const out = Number(fromRaw(rawOut, decOut));
  const inn = Number(fromRaw(rawIn, decIn));
  if (!inn || inn <= 0) return 0;
  return out / inn;
};

export const ratioInPerOutRaw = (rawIn, rawOut, decIn, decOut) => {
  const inn = Number(fromRaw(rawIn, decIn));
  const out = Number(fromRaw(rawOut, decOut));
  if (!out || out <= 0) return 0;
  return inn / out;
};

export const isAnchoredUsd = (addr, bench) => {
  if (!addr || !bench) return false;
  const a = String(addr).toLowerCase();
  return (
    a === String(bench.usdcAddr || "").toLowerCase() ||
    a === String(bench.wshidoAddr || "").toLowerCase()
  );
};
export const getAddrStr = (val) => (typeof val === "string" ? val : val?.address || "");