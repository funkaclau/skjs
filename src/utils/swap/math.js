import {
  fromRaw
} from "../price";

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
  if (!addr || !bench?.usdcAddr) return false;
  const a = addr.toLowerCase();
  return a === bench.usdcAddr.toLowerCase() || a === (bench.usdtAddr || "").toLowerCase();
};


