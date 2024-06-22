/**
 * Small round Accept button with arrow icon
 */
export default function SmallAcceptButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            className="me-2 inline-flex items-center rounded-full bg-green-600 p-2.5 text-center text-sm font-medium text-white hover:bg-green-700"
            aria-label="Accept new client"
            onClick={onClick}
        >
            <svg
                className="h-4 w-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
            >
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                />
            </svg>
        </button>
    );
}
