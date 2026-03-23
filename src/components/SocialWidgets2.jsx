import { FaTelegramPlane, FaGlobe, FaMedium, FaYoutube } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

const getWidgets = (links, size = 24) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
      {["twitter", "telegram", "website", "medium", "youtube"].map((platform) => {
        const link = links[platform];
        const Icon = {
          twitter: BsTwitterX,
          telegram: FaTelegramPlane,
          website: FaGlobe,
          medium: FaMedium,
          youtube: FaYoutube,
        }[platform];

        return (
          <div key={platform} className="relative group">
            <a
              href={link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-opacity duration-200 ${
                link ? "text-white hover:text-yellow-300" : "opacity-30 cursor-not-allowed"
              }`}
              onClick={(e) => !link && e.preventDefault()}
            >
              <Icon size={size} />
            </a>
            {!link && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                No link provided
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default getWidgets;
