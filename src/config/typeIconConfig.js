// src/config/typeIconConfig.js
import { FaFileAlt, FaPlay } from 'react-icons/fa';

const typeIconConfig = {
  article: {
    icon: FaFileAlt,
    color: "text-blue-500",
    tooltip: "Article",
  },
  video: {
    icon: FaPlay,
    color: "text-red-500",
    tooltip: "Video",
  },
};

export default typeIconConfig;