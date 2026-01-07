const iconDefaults = {
  className: 'w-4 h-4',
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: '2',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
};

export const DocumentIcon = ({ className = iconDefaults.className, ...props }) => (
  <svg {...iconDefaults} className={className} {...props}>
    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const PlusIcon = ({ className = iconDefaults.className, ...props }) => (
  <svg {...iconDefaults} className={className} {...props}>
    <path d="M12 4v16m8-8H4" />
  </svg>
);

export const ColumnsIcon = ({ className = iconDefaults.className, ...props }) => (
  <svg {...iconDefaults} className={className} {...props}>
    <path d="M9 4v16M15 4v16M3 8h18M3 16h18" />
  </svg>
);

export const DownloadIcon = ({ className = iconDefaults.className, ...props }) => (
  <svg {...iconDefaults} className={className} {...props}>
    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export const FileIcon = ({ className = iconDefaults.className, ...props }) => (
  <svg {...iconDefaults} className={className} {...props}>
    <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

export const SunIcon = ({ className = iconDefaults.className, ...props }) => (
  <svg {...iconDefaults} className={className} {...props}>
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export const MoonIcon = ({ className = iconDefaults.className, ...props }) => (
  <svg {...iconDefaults} className={className} {...props}>
    <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

export const QuestionIcon = ({ className = iconDefaults.className, ...props }) => (
  <svg {...iconDefaults} className={className} {...props}>
    <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const LogoutIcon = ({ className = iconDefaults.className, ...props }) => (
  <svg {...iconDefaults} className={className} {...props}>
    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export const EditIcon = ({ className = iconDefaults.className, ...props }) => (
  <svg {...iconDefaults} className={className} {...props}>
    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

export const TrashIcon = ({ className = iconDefaults.className, ...props }) => (
  <svg {...iconDefaults} className={className} {...props}>
    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export const ArchiveIcon = ({ className = iconDefaults.className, ...props }) => (
  <svg {...iconDefaults} className={className} {...props}>
    <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);
