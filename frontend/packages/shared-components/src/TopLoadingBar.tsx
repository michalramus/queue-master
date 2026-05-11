interface TopLoadingBarProps {
    hidden?: boolean;
}

export default function TopLoadingBar({ hidden = false }: TopLoadingBarProps) {
    if (hidden) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 z-50 h-1 w-full overflow-hidden bg-transparent">
            <div className="bg-primary-1 animate-slide h-full w-1/3"></div>
        </div>
    );
}
