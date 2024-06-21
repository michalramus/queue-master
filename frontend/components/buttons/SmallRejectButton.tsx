/**
 * Small round reject button with X icon
 */
export default function SmallRejectButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            className="me-2 inline-flex items-center rounded-full bg-red-600 p-2.5 text-center text-sm font-medium text-white hover:bg-red-700"
            aria-label="Reject new client"
            onClick={onClick}
        >
            <svg
                className="h-4 w-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 10"
            >
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                    d="M1 1 L9 9 M9 1 L1 9"
                />
            </svg>
        </button>
    );
}
