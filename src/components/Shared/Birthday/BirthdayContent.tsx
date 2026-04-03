"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import "@/styles/birthday.css";
import { Playfair_Display, Montserrat } from "next/font/google";

const playfair = Playfair_Display({
    subsets: ["latin", "vietnamese"],
    weight: ["400", "700", "900"],
    style: ["normal", "italic"],
    variable: "--font-playfair",
});

const montserrat = Montserrat({
    subsets: ["latin", "vietnamese"],
    weight: ["300", "400", "600"],
    variable: "--font-montserrat",
});

export default function BirthdayContent() {
    const [modalOpen, setModalOpen] = useState(false);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    const heroRef = useRef<HTMLDivElement>(null);
    const modalImgRef = useRef<HTMLImageElement>(null);

    // Gallery images list
    const images = [
        { src: "/images/baby_1.jpg", alt: "Baby's 1st Birthday" },
        { src: "/images/baby_2.jpg", alt: "Hạnh phúc là có Ba Mẹ" },
        { src: "/images/baby_3.jpg", alt: "Tổ ấm nhỏ của Gia Huy" },
        { src: "/images/baby_4.jpg", alt: "Nụ cười tỏa nắng" },
        { src: "/images/baby_5.jpg", alt: "Gắn kết yêu thương" },
        { src: "/images/baby_6.jpg", alt: "Hành trình trải nghiệm" },
        { src: "/images/baby_7.jpg", alt: "Gia Huy Moment 1" },
        { src: "/images/baby_8.jpg", alt: "Gia Huy Moment 2" },
        { src: "/images/baby_9.jpg", alt: "Gia Huy Moment 3" },
        { src: "/images/baby_10.jpg", alt: "Gia Huy Moment 4" },
        { src: "/images/baby_11.jpg", alt: "Gia Huy Moment 5" },
        { src: "/images/baby_12.jpg", alt: "Gia Huy Moment 6" },
        { src: "/images/baby_13.jpg", alt: "Gia Huy Mosaic 1" },
        { src: "/images/baby_14.jpg", alt: "Gia Huy Mosaic 2" },
        { src: "/images/baby_15.jpg", alt: "Gia Huy Mosaic 3" },
        { src: "/images/baby_16.jpg", alt: "Gia Huy Mosaic 4" },
        { src: "/images/baby_17.jpg", alt: "Gia Huy Mosaic 5" },
        { src: "/images/baby_18.jpg", alt: "Gia Huy Mosaic 6" },
        { src: "/images/baby_1.jpg", alt: "Gia Huy Mosaic 7" },
        { src: "/images/baby_2.jpg", alt: "Gia Huy Mosaic 8" },
        { src: "/images/baby_3.jpg", alt: "Gia Huy Moment 7" },
        { src: "/images/baby_4.jpg", alt: "Gia Huy Moment 8" },
        { src: "/images/baby_5.jpg", alt: "Gia Huy Moment 9" },
        { src: "/images/baby_6.jpg", alt: "Gia Huy Moment 10" },
    ];

    useEffect(() => {
        const revealOnScroll = () => {
            const reveals = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
            const triggerBottom = window.innerHeight * 0.85;

            reveals.forEach((el) => {
                const elTop = el.getBoundingClientRect().top;
                if (elTop < triggerBottom) {
                    el.classList.add("active");
                }
            });
        };

        const handleScroll = () => {
            revealOnScroll();
            if (heroRef.current) {
                const scrolled = window.pageYOffset;
                heroRef.current.style.transform = `translateY(${scrolled * -0.2}px)`;
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Chạy animation ngay lập tức khi vào trang
        revealOnScroll();
        document.querySelectorAll(".hero .fade-up").forEach((el) => {
            el.classList.add("active");
        });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const openModal = (index: number) => {
        setCurrentImgIndex(index);
        setModalOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        setModalOpen(false);
        document.body.style.overflow = "auto";
    };

    const nextImg = useCallback((e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCurrentImgIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevImg = useCallback((e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);



    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (modalOpen) {
                if (e.key === "Escape") closeModal();
                if (e.key === "ArrowRight") nextImg();
                if (e.key === "ArrowLeft") prevImg();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [modalOpen, nextImg, prevImg]);

    return (
        <div className={`birthday-page ${playfair.variable} ${montserrat.variable}`}>

            <header className="hero">
                <div className="blob" style={{ position: 'absolute', top: '10%', right: '10%', zIndex: 0 }}></div>
                <div className="blob" style={{ position: 'absolute', bottom: '20%', left: '5%', width: '400px', height: '400px', zIndex: 0 }}></div>

                <div className="hero-image-container" ref={heroRef}>
                    <Image
                        src="/images/baby_1.jpg"
                        alt="Baby's 1st Birthday"
                        className="hero-img"
                        fill
                        priority
                        quality={100}
                        sizes="100vw"
                        style={{ objectFit: 'cover' }}
                    />
                    <div className="overlay"></div>
                </div>
                <div className="hero-content">
                    <h1 className="fade-up">
                        Vũ Gia Huy <br />
                        <span>Tròn 1 Tuổi</span>
                    </h1>
                    <p className="fade-up delay-1">Sinh ngày 24/01/2025 • Chào mừng dấu mốc đầu đời</p>
                </div>
                <div className="scroll-indicator fade-up delay-2">
                    <div className="mouse" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}></div>
                    <p>Cuộn xuống</p>
                </div>
            </header>

            <section className="welcome section-padding">
                <div className="container">
                    <div className="text-center">
                        <h2 className="section-title reveal">Ngày của Gia Huy...</h2>
                        <p className="section-desc reveal">
                            Ngày 24/01/2025, tiếng khóc chào đời của Gia Huy đã biến thế giới của ba mẹ trở nên rực rỡ hơn bao giờ hết.
                            Một năm qua là 365 ngày tràn ngập niềm hạnh phúc khi thấy con lớn khôn.
                        </p>
                    </div>
                </div>
            </section>

            <section className="journey">
                <div className="timeline-line"></div>
                <div className="milestone reveal-left">
                    <div className="milestone-image" onClick={() => openModal(1)} style={{ position: 'relative' }}>
                        <Image src="/images/baby_2.jpg" alt="Sleeping Baby" fill priority quality={95} sizes="(max-width: 768px) 100vw, 70vw" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="milestone-content">
                        <span className="number">01</span>
                        <h3>Hạnh phúc là có <span className="highlight">Ba Mẹ</span></h3>
                        <p> Trong vòng tay và trên đôi vai vững chãi của Ba, sự dịu dàng của Mẹ, Gia Huy được lớn khôn trong một <span className="highlight">biển trời yêu thương</span> vô bờ bến.</p>
                    </div>
                </div>
                <div className="milestone reveal-right alt">
                    <div className="milestone-image" onClick={() => openModal(2)} style={{ position: 'relative' }}>
                        <Image src="/images/baby_3.jpg" alt="First Steps" fill priority quality={95} sizes="(max-width: 768px) 100vw, 70vw" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="milestone-content">
                        <span className="number">02</span>
                        <h3>Tổ ấm nhỏ của <span className="highlight">Gia Huy</span></h3>
                        <p> Mỗi khoảnh khắc cả nhà mình bên nhau đều là những <span className="highlight">trang hồi ký đẹp nhất</span> mà Ba Mẹ muốn lưu giữ mãi mãi trong trái tim dành cho con.</p>
                    </div>
                </div>
                <div className="milestone reveal-left">
                    <div className="milestone-image" onClick={() => openModal(3)} style={{ position: 'relative' }}>
                        <Image src="/images/baby_4.jpg" alt="Birthday Cake" fill quality={95} sizes="(max-width: 768px) 100vw, 70vw" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="milestone-content">
                        <span className="number">03</span>
                        <h3>Nụ cười <span className="highlight">tỏa nắng</span></h3>
                        <p> Nụ cười của con chính là <span className="highlight">ánh nắng rực rỡ nhất</span>, xua tan mọi mệt mỏi và sưởi ấm tâm hồn Ba Mẹ mỗi ngày trôi qua.</p>
                    </div>
                </div>
                <div className="milestone reveal-right alt">
                    <div className="milestone-image" onClick={() => openModal(4)} style={{ position: 'relative' }}>
                        <Image src="/images/baby_5.jpg" alt="Family Time" fill quality={95} sizes="(max-width: 768px) 100vw, 70vw" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="milestone-content">
                        <span className="number">04</span>
                        <h3>Gắn kết <span className="highlight">yêu thương</span></h3>
                        <p> Hạnh phúc không ở đâu xa, nó nằm ngay trong những <span className="highlight">cái ôm</span>, những ánh mắt trìu mến khi cả gia đình mình cùng đồng hành bên nhau.</p>
                    </div>
                </div>
                <div className="milestone reveal-left">
                    <div className="milestone-image" onClick={() => openModal(5)} style={{ position: 'relative' }}>
                        <Image src="/images/baby_6.jpg" alt="Birthday Celebration" fill quality={95} sizes="(max-width: 768px) 100vw, 70vw" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="milestone-content">
                        <span className="number">05</span>
                        <h3>Hành trình <span className="highlight">trải nghiệm</span></h3>
                        <p> Một tuổi đầu đời với biết bao bỡ ngỡ, nhưng cũng <span className="highlight">đầy ắp tiếng cười</span>. Chúc Gia Huy của Ba Mẹ luôn mạnh khỏe, thông minh và thật bình an.</p>
                    </div>
                </div>
            </section>

            <section className="welcome section-padding" style={{ paddingBottom: "50px" }}>
                <div className="container">
                    <div className="text-center">
                        <h2 className="section-title reveal">Khoảnh khắc rạng rỡ</h2>
                        <p className="section-desc reveal">Toàn bộ 18 khoảnh khắc đáng yêu nhất của Gia Huy trong suốt một năm qua.</p>
                    </div>
                </div>
            </section>

            <section className="gallery-section">
                <div className="gallery-grid">
                    <div className="gallery-item wide reveal-left" onClick={() => openModal(6)} style={{ position: 'relative' }}>
                        <Image src="/images/baby_7.jpg" alt="Gia Huy Moment" fill quality={90} sizes="(max-width: 768px) 100vw, 70vw" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="gallery-item tall reveal-right" onClick={() => openModal(7)} style={{ position: 'relative' }}>
                        <Image src="/images/baby_8.jpg" alt="Gia Huy Moment" fill quality={90} sizes="(max-width: 768px) 100vw, 40vw" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="gallery-item reveal-left" onClick={() => openModal(8)} style={{ position: 'relative' }}>
                        <Image src="/images/baby_9.jpg" alt="Gia Huy Moment" fill quality={90} sizes="(max-width: 768px) 50vw, 30vw" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="gallery-item reveal" onClick={() => openModal(9)} style={{ position: 'relative' }}>
                        <Image src="/images/baby_10.jpg" alt="Gia Huy Moment" fill quality={90} sizes="(max-width: 768px) 50vw, 30vw" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="gallery-item reveal-right" onClick={() => openModal(10)} style={{ position: 'relative' }}>
                        <Image src="/images/baby_11.jpg" alt="Gia Huy Moment" fill quality={90} sizes="(max-width: 768px) 50vw, 30vw" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="gallery-item wide reveal" onClick={() => openModal(11)} style={{ position: 'relative' }}>
                        <Image src="/images/baby_12.jpg" alt="Gia Huy Moment" fill quality={90} sizes="(max-width: 768px) 100vw, 70vw" style={{ objectFit: 'cover' }} />
                    </div>
                </div>
            </section>

            <section className="mosaic-section">
                <div className="mosaic-grid">
                    {images.slice(12, 20).map((img, idx) => (
                        <div key={idx} className="mosaic-item reveal" onClick={() => openModal(12 + idx)} style={{ position: 'relative' }}>
                            <Image src={img.src} alt={img.alt} fill quality={90} sizes="(max-width: 768px) 50vw, 30vw" style={{ objectFit: 'cover' }} />
                        </div>
                    ))}
                </div>
            </section>

            <section className="gallery-section" style={{ paddingTop: 0 }}>
                <div className="gallery-grid">
                    <div className="gallery-item reveal-left" onClick={() => openModal(20)} style={{ position: 'relative' }}>
                        <Image src="/images/baby_3.jpg" alt="Gia Huy Moment" fill quality={90} sizes="(max-width: 768px) 100vw, 30vw" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="gallery-item tall reveal" onClick={() => openModal(21)} style={{ position: 'relative' }}>
                        <Image src="/images/baby_4.jpg" alt="Gia Huy Moment" fill quality={90} sizes="(max-width: 768px) 100vw, 30vw" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="gallery-item wide reveal-right" onClick={() => openModal(22)} style={{ position: 'relative' }}>
                        <Image src="/images/baby_5.jpg" alt="Gia Huy Moment" fill quality={90} sizes="(max-width: 768px) 100vw, 70vw" style={{ objectFit: 'cover' }} />
                    </div>
                    <div className="gallery-item reveal" onClick={() => openModal(23)} style={{ position: 'relative' }}>
                        <Image src="/images/baby_6.jpg" alt="Gia Huy Moment" fill quality={90} sizes="(max-width: 768px) 100vw, 30vw" style={{ objectFit: 'cover' }} />
                    </div>
                </div>
            </section>

            <section className="letter section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
                <div className="blob" style={{ position: 'absolute', bottom: '-20%', right: '5%', background: 'rgba(197, 160, 89, 0.15)', zIndex: 0 }}></div>
                <div className="container">
                    <div className="letter-box reveal">
                        <div className="card-edge top"></div>
                        <h2>Gửi Gia Huy yêu dấu,</h2>
                        <div className="letter-body">
                            <p> Gia Huy à, vậy là con đã tròn 1 tuổi rồi. Một năm qua là một hành trình kỳ diệu mà ba mẹ may mắn được đồng hành cùng con. Ba mẹ không mong gì hơn ngoài việc con luôn khỏe mạnh, bình an và giữ mãi nét hồn nhiên, rạng rỡ này.</p>
                            <p> Thế giới ngoài kia rộng lớn lắm, nhưng đừng lo nhé, vì ba mẹ sẽ luôn là bến đỗ bình yên nhất của con. Chúc mừng sinh nhật đầu tiên của con trai, tình yêu của cả gia đình mình!</p>
                        </div>
                        <p className="signature">— Ba và Mẹ</p>
                        <div className="card-edge bottom"></div>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <p>&copy; 2026 • Vũ Gia Huy&apos;s 1st Birthday</p>
                <p className="made-with">Lưu giữ với ❤️ dành cho Gia Huy</p>
            </footer>

            {modalOpen && (
                <div id="imageModal" className="modal" style={{ display: "block" }} onClick={closeModal}>
                    <span className="close-modal" onClick={closeModal}>&times;</span>
                    <span className="nav-prev" onClick={prevImg}>&lsaquo;</span>
                    <div className="modal-image-wrapper">
                        <Image
                            ref={modalImgRef}
                            className="modal-content"
                            src={images[currentImgIndex].src}
                            alt={images[currentImgIndex].alt}
                            width={1200}
                            height={800}
                            style={{
                                width: 'auto',
                                height: 'auto',
                                maxWidth: '100%',
                                maxHeight: '90vh',
                                objectFit: 'contain'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <span className="nav-next" onClick={nextImg}>&rsaquo;</span>
                    <div id="caption">{images[currentImgIndex].alt}</div>
                </div>
            )}
        </div>
    );
}


