"use client";

import { useState, useEffect } from "react";
import DOMPurify from "dompurify";

export default function SanitizedHtml({
    html,
    className,
}: {
    html: string;
    className?: React.ComponentProps<"div">["className"];
}) {
    const [sanitized, setSanitized] = useState("");

    useEffect(() => {
        setSanitized(DOMPurify.sanitize(html));
    }, [html]);

    return <div className={className} dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
