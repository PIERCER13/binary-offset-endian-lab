// @author piercer
(() => {
  const KEY = "piercer_bin_lab_v1";
  const $ = (id) => document.getElementById(id);
  const IDS = ["hexVal", "rvaHex", "secVa", "secRaw"];

  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "{}");
    IDS.forEach((id) => { if (s[id] !== undefined) $(id).value = s[id]; });
  } catch {}

  function render() {
    const data = {};
    IDS.forEach((id) => { data[id] = $(id).value; });
    localStorage.setItem(KEY, JSON.stringify(data));

    let clean = $("hexVal").value.replace(/0x|\s+/gi, "");
    if (clean.length % 2 !== 0) clean = "0" + clean;
    const bytes = clean.match(/.{2}/g) || ["00"];
    const le = [...bytes].reverse();

    const num = BigInt("0x" + (clean || "0"));
    $("endianOut").textContent = [
      `Big-Endian   : ${bytes.join(" ").toUpperCase()}`,
      `Little-Endian: ${le.join(" ").toUpperCase()}`,
      `C Bytes (LE) : ${le.map((b) => "\\x" + b.toLowerCase()).join("")}`,
      `Decimal      : ${num.toString(10)}`,
    ].join("\n");

    const rva = parseInt($("rvaHex").value.replace(/0x/i, ""), 16) || 0;
    const va = parseInt($("secVa").value.replace(/0x/i, ""), 16) || 0;
    const raw = parseInt($("secRaw").value.replace(/0x/i, ""), 16) || 0;
    const fileOff = raw + (rva - va);
    $("rvaOut").textContent = fileOff >= 0
      ? `File Offset (RAW): 0x${fileOff.toString(16).toUpperCase()} (${fileOff} dec)`
      : "RVA está abaixo do VirtualAddress da seção.";
  }

  IDS.forEach((id) => $(id).addEventListener("input", render));
  render();
})();
