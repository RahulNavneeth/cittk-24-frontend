"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import Card from "@/components/Card";
import { FilterComponent, NavBar } from "@/components";
import { PARSE } from "@/libs/utils";
import { useSearchParams } from "next/navigation"

export default function Events() {
    type Type =
        | "ALL"
        | "TECHNICAL"
        | "NON-TECHNICAL"
        | "WORKSHOP"
        | "PRO SHOW"
        | "ONLINE EVENT";
    type infoType = { name: string; type: Type; date: string };
    const [filter, setFilter] = useState<Type>("ALL");
    const [queue, setQueue] = useState<Record<string, infoType> | null>(null);

    const P = useSearchParams();
    useEffect(() => {
        if (P.has("filter")) {
            if (P.get("filter") === "ALL" || P.get("filter") === "TECHNICAL" || P.get("filter") === "NON-TECHNICAL" || P.get("filter") === "WORKSHOP" || P.get("filter") === "PRO SHOW" || P.get("filter") === "ONLINE EVENT") {
                setFilter(P.get("filter") as Type);
            }
        }
        const fetchFolders = async () => {
            const res = await fetch("/api/events/folder");
            const data = (await res.json()) as {
                payload: { blob: { rawLines: Array<string> } };
            };
            setQueue(PARSE(data.payload.blob.rawLines) as Record<string, infoType>);
        };
        if (!queue) {
            fetchFolders();
        }
    }, []);

    const filteredEvents = Object.entries(queue || {}).filter(
        ([_, value]) => filter === "ALL" || value.type === filter,
    );

    return (
        <>
            <NavBar />
            <main className="lg:pt-24 min-h-screen bg-cit-crowd bg-cover bg-fixed ">
                <FilterComponent type={filter} setFilter={setFilter} />
                <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8 lg:pt-0 relative ">
                    <section className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                        {filteredEvents.map(([key, value], index: number) => (
                            <Card
                                id={key}
                                name={value.name}
                                category={value.type}
                                date={value.date}
                                key={index}
                            />
                        ))}
                    </section>
                </section>
            </main>
        </>
    );
}
