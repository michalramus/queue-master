interface PageHeaderProps {
    title: string;
    action?: React.ReactNode;
}

export default function PageHeader({ title, action }: PageHeaderProps) {
    return (
        <div className="mb-6 flex items-center justify-between">
            <h1 className="text-text-1 text-3xl font-bold">{title}</h1>
            {action}
        </div>
    );
}
