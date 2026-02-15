"use client";

import { useState } from "react";

type CardProps = {
  title: string;
  choices: string[];
};

const Card = ({ title, choices }: CardProps) => {
  const [selected, setSelected] = useState<string | null>(null);
  const handleSubmit = () => {
    console.log({ title, choices });
  };
  return (
    <div className="border rounded-xl p-6 w-full max-w-md shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="space-y-2">
        {choices.map((choice, index) => (
          <div
            key={index}
            className={`p-3 border rounded-lg hover:bg-gray-150 cursor-pointer transition-colors ${selected === choice ? "bg-blue-200" : ""}`}
            onClick={() => setSelected(choice)}
          >
            {choice}
          </div>
        ))}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-20 py-2 mr-auto bg-blue-500 text-white rounded-lg hover:bg-blue-300 transition font-medium"
        >
          回答する
        </button>
      </div>
    </div>
  );
};

export default Card;