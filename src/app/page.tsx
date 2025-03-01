"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const toggleSeatSelection = (seat: string) => {
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seat)
        ? prevSelectedSeats.filter((s) => s !== seat)
        : [...prevSelectedSeats, seat]
    );
  };

  const totalPrice = selectedSeats.length * 1000;  

  const renderSeats = () => {
  const seats = [];
  for (let row = 1; row <= 19; row++) {
    for (let col = 1; col <= 4; col++) {
      if (col === 3) { 
        seats.push(<div key={`spacer-${row}`} className={styles.spacer}></div>);
      }

      const seat = `${row}${String.fromCharCode(64 + col)}`;
      seats.push(
        <button
          key={seat}
          className={`${styles.seatButton} ${
            selectedSeats.includes(seat) ? styles.selected : ""
          }`}
          onClick={() => toggleSeatSelection(seat)}
        />
      );
    }
  }
  return seats;
};


  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.columns}>
          <div className={styles.leftColumn}>
            <div className={styles.imageWrapper}>
              <Image src="/ucak.png" alt="Flight" className={styles.image} layout="responsive" width={900} height={1200} />
             <div className={styles.seatWrapper}>
              <div className={styles.seatMap}>
                {renderSeats()}
              </div></div>
            </div>
          </div>
          <div className={styles.rightColumn}>
            {[1, 2, 3].map((passenger, index) => (
              <div
                key={passenger}
                className={`${styles.passengerCard} ${activeIndex === index ? styles.active : ""}`}
              >
                <div
                  className={styles.passengerHeader}
                  onClick={() => toggleAccordion(index)}
                >
                  {passenger}. Yolcu
                  <span className={`${styles.arrowIcon} ${activeIndex === index ? styles.active : ""}`}>
                    
                  </span>
                </div>
                <div className={styles.passengerContent}>
                  <div className={styles.inputGroup}>
                    <label>İsim</label>
                    <input type="text" className={styles.input} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Soyisim</label>
                    <input type="text" className={styles.input} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Telefon</label>
                    <input type="tel" className={styles.input} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>E-Posta</label>
                    <input type="email" className={styles.input} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Cinsiyet</label>
                    <input type="text" className={styles.input} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Doğum Tarihi</label>
                    <input type="date" className={styles.input} />
                  </div>
                </div>
              </div>
            ))}
            <button className={styles.completeButton}>İşlemleri Tamamla</button>
            <div className={styles.summarySection}>
              <div className={styles.selectedSeats}>
                <ul>
                  {selectedSeats.map((seat, index) => (
                    <li key={index}>{seat}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.seatSummary}>
                <span>{selectedSeats.length}x</span>
                <span className={styles.seat}></span>
                <span className={styles.price}>{totalPrice} TL</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
