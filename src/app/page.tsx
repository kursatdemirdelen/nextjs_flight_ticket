"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./page.module.css";

type User = {
  id: number;
  name: string;
};

export default function Home() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [occupiedSeatsData, setOccupiedSeatsData] = useState<{ [key: string]: string }>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const occupiedSeats = Object.keys(occupiedSeatsData);

  useEffect(() => {
    // Dolu koltuk verilerini API'den çek
    const fetchOccupiedSeatsData = async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      const data: Pick<User, "id" | "name">[] = await response.json();

      const seatsData = data.slice(0, 10).reduce((acc: { [key: string]: string }, user, index) => {
        acc[(index + 1).toString()] = user.name;
        return acc;
      }, {});

      setOccupiedSeatsData(seatsData);
    };

    fetchOccupiedSeatsData();
  }, []);

  useEffect(() => {
    // Seçilen koltukları localStorage'dan al
    const savedSelectedSeats = localStorage.getItem("selectedSeats");
    if (savedSelectedSeats) {
      setSelectedSeats(JSON.parse(savedSelectedSeats));
    }
  }, []);

  useEffect(() => {
    // Seçilen koltukları localStorage'a kaydet
    localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
  }, [selectedSeats]);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (confirm("İşleme devam etmek istiyor musunuz?")) {
        resetTimeout();
      } else {
        localStorage.removeItem("selectedSeats");
        window.location.reload();
      }
    }, 30000);
  };

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
    resetTimeout();
  };

  const toggleSeatSelection = (seat: string) => {
    if (occupiedSeats.includes(seat)) {
      alert("Bu koltuk dolu! Lütfen başka bir koltuk seçin.");
      return;
    }
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else if (selectedSeats.length < 3) {
      setSelectedSeats([...selectedSeats, seat]);
    }
    resetTimeout();
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    selectedSeats.forEach((seat, index) => {
      const passengerPrefix = `passenger-${index}`;
      const nameInput = document.getElementById(`${passengerPrefix}-name`) as HTMLInputElement;
      const surnameInput = document.getElementById(`${passengerPrefix}-surname`) as HTMLInputElement;
      const phoneInput = document.getElementById(`${passengerPrefix}-phone`) as HTMLInputElement;
      const emailInput = document.getElementById(`${passengerPrefix}-email`) as HTMLInputElement;
      const genderInput = document.getElementById(`${passengerPrefix}-gender`) as HTMLInputElement;
      const birthdateInput = document.getElementById(`${passengerPrefix}-birthdate`) as HTMLInputElement;

      if (!nameInput?.value) errors[`${passengerPrefix}-name`] = "İsim gerekli";
      if (!surnameInput?.value) errors[`${passengerPrefix}-surname`] = "Soyisim gerekli";
      if (!phoneInput?.value) errors[`${passengerPrefix}-phone`] = "Telefon gerekli";
      if (!emailInput?.value) errors[`${passengerPrefix}-email`] = "E-Posta gerekli";
      if (!genderInput?.value) errors[`${passengerPrefix}-gender`] = "Cinsiyet gerekli";
      if (!birthdateInput?.value) errors[`${passengerPrefix}-birthdate`] = "Doğum Tarihi gerekli";
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleComplete = () => {
    if (validateForm()) {
      alert("Rezervasyon işlemi başarıyla tamamlandı!");
    } else {
      alert("Lütfen tüm alanları doldurun.");
    }
  };

  const totalPrice = selectedSeats.length * 1000;

  const renderSeats = () => {
    const seats = [];
    let seatNumber = 1;

    for (let row = 1; row <= 19; row++) {
      for (let col = 1; col <= 4; col++) {
        if (col === 3) {
          seats.push(<div key={`spacer-${row}`} className={styles.spacer}></div>);
        }

        const seat = `${seatNumber}`;

        seats.push(
          <button
            key={seatNumber}
            className={`${styles.seatButton} ${
              occupiedSeats.includes(seat)
                ? styles.occupied
                : selectedSeats.includes(seat)
                ? styles.selected
                : ""
            }`}
            onClick={() => toggleSeatSelection(seat)}
            data-tooltip={occupiedSeatsData[seat] || ""}
          > 
          </button>
        );

        seatNumber++;
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
                </div>
              </div>
            </div>
          </div>
          <div className={styles.rightColumn}>
            {selectedSeats.map((seat, index) => (
              <div
                key={seat}
                className={`${styles.passengerCard} ${activeIndex === index ? styles.active : ""}`}
              >
                <div
                  className={styles.passengerHeader}
                  onClick={() => toggleAccordion(index)}
                >
                  {index + 1}. Yolcu
                  <span className={`${styles.arrowIcon} ${activeIndex === index ? styles.active : ""}`}></span>
                </div>
                {activeIndex === index && (
                  <div className={styles.passengerContent}>
                    <div className={styles.inputGroup}>
                      <label>İsim</label>
                      <input id={`passenger-${index}-name`} type="text" className={styles.input} />
                      {formErrors[`passenger-${index}-name`] && <span className={styles.error}>{formErrors[`passenger-${index}-name`]}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Soyisim</label>
                      <input id={`passenger-${index}-surname`} type="text" className={styles.input} />
                      {formErrors[`passenger-${index}-surname`] && <span className={styles.error}>{formErrors[`passenger-${index}-surname`]}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Telefon</label>
                      <input id={`passenger-${index}-phone`} type="tel" className={styles.input} />
                      {formErrors[`passenger-${index}-phone`] && <span className={styles.error}>{formErrors[`passenger-${index}-phone`]}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                      <label>E-Posta</label>
                      <input id={`passenger-${index}-email`} type="email" className={styles.input} />
                      {formErrors[`passenger-${index}-email`] && <span className={styles.error}>{formErrors[`passenger-${index}-email`]}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Cinsiyet</label>
                      <input id={`passenger-${index}-gender`} type="text" className={styles.input} />
                      {formErrors[`passenger-${index}-gender`] && <span className={styles.error}>{formErrors[`passenger-${index}-gender`]}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Doğum Tarihi</label>
                      <input id={`passenger-${index}-birthdate`} type="date" className={styles.input} />
                      {formErrors[`passenger-${index}-birthdate`] && <span className={styles.error}>{formErrors[`passenger-${index}-birthdate`]}</span>}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button className={styles.completeButton} onClick={handleComplete}>İşlemleri Tamamla</button>
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
