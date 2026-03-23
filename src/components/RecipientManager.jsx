import { formatAmount } from "../utils";
import { useState } from "react";
import {CN} from "../utils"
import { FaPlusCircle } from "react-icons/fa";
function RecipientManager({
  recipients,
  setRecipients,
  totalAmount,
  setTotalAmount,
  onParseInputs,
  addressInput,
  setAddressInput,
  amountInput,
  setAmountInput,
  addRecipient,
  symbol = "SHIDO",
  decimals = 18
}) {
  const [inputMethod, setInputMethod] = useState("");

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 flex flex-col items-center text-center">

      {/* Method Selector */}
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2 text-white">🔢 Select Input Method</h2>
        <select
          value={inputMethod}
          onChange={(e) => setInputMethod(e.target.value)}
          className="w-50 bg-gray-800 text-white border border-white/20 px-4 py-2 rounded-md appearance-none focus:outline-none"
        >
          <option value="" disabled>
            -- Select Method --
          </option>
          <option value="manual">Add Manually</option>
          <option value="bulk">Add in Bulk</option>
        </select>
      </div>

      {/* Recipient List */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-white">Recipient List</h3>
        <div className="space-y-2">
          {recipients.map((r, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-white/5 border border-white/10 px-4 py-2 rounded-md text-sm text-white"
            >
              <span>
                {index + 1}. {r.address} - {formatAmount(r.amount.toString())} {symbol}
              </span>
              <button
                className="text-red-400 hover:text-red-200 font-bold ml-4"
                onClick={() => {
                  const updated = recipients.filter((_, i) => i !== index);
                  setRecipients(updated);
                  setTotalAmount(totalAmount - r.amount);
                }}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Input Method Panels */}
      {inputMethod === "manual" && (
        <div>
          <h5 className="text-primary mb-2 text-white">Add Recipients One by One</h5>
          <button
            className={CN.buttonPrimary}
            onClick={addRecipient}
          >
            <FaPlusCircle className="mr-2" />
            Add Recipient
          </button>
        </div>
      )}

      {inputMethod === "bulk" && (
        <div>
          <h5 className="text-primary mb-2 text-white">Input addresses/amounts separated by commas</h5>
          <textarea
            className="w-full h-28 mb-4 p-2 rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 resize-none"
            placeholder="Enter addresses (comma separated)"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
          />
          <textarea
            className="w-full h-28 mb-4 p-2 rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 resize-none"
            placeholder="Enter amounts (comma separated)"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
          />
          <button
            className={CN.buttonPrimary}
            onClick={onParseInputs}
          >
            🧮 Parse Inputs
          </button>
        </div>
      )}
    </div>
  );
}

export default RecipientManager;
