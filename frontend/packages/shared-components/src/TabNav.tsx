import TabNavButton from "./TabNavButton";

interface TabNavItem<T extends string> {
    key: T;
    label: string;
}

interface TabNavProps<T extends string> {
    tabs: TabNavItem<T>[];
    activeTab: T;
    onChange: (key: T) => void;
    className?: string;
}

export default function TabNav<T extends string>({
    tabs,
    activeTab,
    onChange,
    className,
}: TabNavProps<T>) {
    return (
        <div className={`border-gray-1 flex space-x-4 border-b ${className ?? ""}`}>
            {tabs.map((tab) => (
                <TabNavButton
                    key={tab.key}
                    label={tab.label}
                    isActive={activeTab === tab.key}
                    onClick={() => onChange(tab.key)}
                />
            ))}
        </div>
    );
}
