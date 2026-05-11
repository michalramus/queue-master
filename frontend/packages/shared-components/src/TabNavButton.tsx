interface TabNavButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

export default function TabNavButton({ label, isActive, onClick }: TabNavButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`px-4 pb-2 font-medium transition-colors ${
                isActive
                    ? "border-primary-1 text-primary-1 border-b-2"
                    : "text-text-2 hover:text-text-1"
            }`}
        >
            {label}
        </button>
    );
}
