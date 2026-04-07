"use client";
import { useState } from "react";

const AboutUs = ({ about }: { about: string }) => {
    return (
        <div className="h-full w-full p-4 rounded-2xl">
            <div
                style={{
                    border: "1px solid #989898",
                    borderRadius: 10,
                    padding: "20px",
                    minHeight: "600px",
                    maxHeight: "600px",
                    marginTop: "20px",
                    color: "rgba(255,255,255,0.8)",
                    overflow: "auto",
                    background: "var(--color-inputBg)",
                }}
                dangerouslySetInnerHTML={{
                    __html: about || "No content yet.",
                }}
            />
        </div>
    )
};


export default AboutUs;
