"use client";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import { useEffect, useState, useRef } from "react";

const useInterval = (callback: () => void, delay: any) => {
  const savedCallback: any = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback?.current();
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

  useEffect(() => {
    fetch(`/api/users`)
      .then((res) => res.json())
      .then((res) => setUsers(res.data));
  }, []);

  useEffect(() => {
    if (!users || users.length < 1) return;

    const usersname = users.map((user) => user.name).join(",");
    fetch(`/api/status?users=${encodeURIComponent(usersname)}`)
      .then((res) => res.json())
      .then((res) => setStatus(res.data));
  }, [users]);

  useInterval(() => {
    if (!users || users.length < 1) return;

    const usersname = users.map((user) => user.name).join(",");
    fetch(`/api/status?users=${encodeURIComponent(usersname)}`)
      .then((res) => res.json())
      .then((res) => setStatus(res.data));
  }, 3000);

  console.log("env", process.env.NEXT_PUBLIC_URL);
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
            <button
              onClick={() => {
                fetch(`/api/heartbeat?user=${key}`);
              }}
            >
              {key}
            </button>{" "}
            -{" "}
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
