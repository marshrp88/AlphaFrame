import React from "react";

export function Table({ children, ...props }) {
  return <table className="w-full border" {...props}>{children}</table>;
}

export function TableRow({ children }) {
  return <tr className="border-t">{children}</tr>;
}

export function TableCell({ children }) {
  return <td className="p-2 border">{children}</td>;
}

export function TableHeader({ children }) {
  return <th className="p-2 border text-left bg-gray-100">{children}</th>;
} 
