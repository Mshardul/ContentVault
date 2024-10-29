// src/config/statusIconConfig.js

import { FaStar, FaBookmark, FaBolt } from 'react-icons/fa';

const statusIconConfig = {
  premium: {
    color: 'text-yellow-400', // Gold color for premium
    icon: FaStar,
    tooltip: 'Premium Content'
  },
  popular: {
    color: 'text-blue-400', // Blue color for unread
    icon: FaBookmark,
    tooltip: 'Unread'
  },
  new: {
    color: 'text-red-400', // Red color for newly added content
    icon: FaBolt,
    tooltip: 'Newly Added'
  },
};

export default statusIconConfig;