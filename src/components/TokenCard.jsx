import { useNavigate } from "react-router-dom";

import { shortenAddress, copyToClipboard, CN } from "../utils";
export default function TokenCard({ address, name, symbol }) {
    const navigate = useNavigate();

    return (
        <div className={`${CN.baseCard} text-center`} onClick={() => navigate(`/token/${address}`)}>
            <h3>{name} ({symbol})</h3>
            <b className="clickable-address" onClick={() => copyToClipboard(address)}>
                {shortenAddress(address)}
            </b>    

        </div>
    );
}