export function OraSymbols() {
  return (
    <svg
      aria-hidden="true"
      height="0"
      style={{ position: "absolute" }}
      width="0"
    >
      <defs>
        <symbol id="ora-mark" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            fill="none"
            r="13"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <line
            stroke="currentColor"
            strokeWidth="1.25"
            x1="24"
            x2="24"
            y1="7"
            y2="41"
          />
          <line
            stroke="currentColor"
            strokeWidth="1.25"
            x1="7"
            x2="41"
            y1="24"
            y2="24"
          />
          <rect
            fill="none"
            height="8"
            stroke="currentColor"
            strokeWidth="1.25"
            transform="rotate(45 24 24)"
            width="8"
            x="20"
            y="20"
          />
        </symbol>

        <symbol id="ora-sun" viewBox="0 0 48 48">
          <g fill="none" stroke="currentColor" strokeWidth="1.25">
            <circle cx="24" cy="24" r="12" />
            <circle cx="24" cy="24" fill="currentColor" r="2" />
            <line x1="24" x2="24" y1="4" y2="11" />
            <line x1="24" x2="24" y1="37" y2="44" />
            <line x1="4" x2="11" y1="24" y2="24" />
            <line x1="37" x2="44" y1="24" y2="24" />
            <line x1="10" x2="14" y1="10" y2="14" />
            <line x1="34" x2="38" y1="34" y2="38" />
            <line x1="38" x2="34" y1="10" y2="14" />
            <line x1="14" x2="10" y1="34" y2="38" />
          </g>
        </symbol>

        <symbol id="ora-moon" viewBox="0 0 48 48">
          <path
            d="M30 9a16 16 0 1 0 0 30A13 13 0 0 1 30 9Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.25"
          />
        </symbol>

        <symbol id="ora-star" viewBox="0 0 48 48">
          <path
            d="M24 6c1.6 8.5 9 15.9 17.5 18C33 26 25.6 33.5 24 42c-1.6-8.5-9-15.9-17.5-18C15 22 22.4 14.5 24 6Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.25"
          />
        </symbol>

        <symbol id="ora-search" viewBox="0 0 48 48">
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.25"
          >
            <circle cx="19" cy="19" r="8" />
            <line x1="24.6" x2="40" y1="24.6" y2="40" />
            <line x1="33" x2="38" y1="36" y2="31" />
          </g>
        </symbol>

        <symbol id="ora-eye" viewBox="0 0 48 48">
          <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.25">
            <path d="M6 24c5-9 13-13 18-13s13 4 18 13c-5 9-13 13-18 13S11 33 6 24Z" />
            <circle cx="24" cy="24" r="5" />
          </g>
        </symbol>
      </defs>
    </svg>
  );
}
