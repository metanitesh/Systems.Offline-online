"use client";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import { useEffect, useState, useRef } from "react";

const inter = Inter({ subsets: ["latin"] });

export const useInterval = (callback: any, delay: any) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current() as any;
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export default function Home() {
  const [users, setUsers] = useState<any>([]);
  const [status, setStatus] = useState<any>({});

  useInterval(() => {
    fetch("http://localhost:3000/api/users")
      .then((res) => res.json())
      .then((res) => setUsers(res.data));
  }, 500);

  useEffect(() => {
    if (!users || users.length < 1) return;

    const usersname = users.map((user) => user.name).join(",");
    fetch(
      `http://localhost:3000/api/status?users=${encodeURIComponent(usersname)}`
    )
      .then((res) => res.json())
      .then((res) => setStatus(res.data));
  }, [users]);

  console.log(status);
  if (!users) {
    return;
  }

  if (!status) {
    return;
  }

  return (
    <>
      <main className={styles.main}>
        {Object.keys(status).map((key) => (
          <div key={key}>
            {key} -{" "}
            {status[key] ? (
              <span style={{ color: "green" }}>online</span>
            ) : (
              <span style={{ color: "red" }}>Offline</span>
            )}
          </div>
        ))}
      </main>
    </>
  );
}
