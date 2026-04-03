"use client";

import { ReactNode } from "react";

interface CustomSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export default function CustomSection({
  title,
  description,
  children,
  actions,
}: CustomSectionProps) {
  return (
    <section className="bg-white rounded-xl shadow-sm border p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div>
          {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
          {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div>{children}</div>
    </section>
  );
}



