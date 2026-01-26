import './loading.css';

export default function Loading() {
    return (
        <div className="loading-container">
            <div className="logo-wrapper">
                <svg
                    className="logo-svg"
                    width="120"
                    height="120"
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Book pages */}
                    <path
                        d="M30 20 L30 100 L60 90 L60 10 Z"
                        fill="url(#gradient1)"
                        opacity="0.9"
                    />
                    <path
                        d="M60 10 L60 90 L90 100 L90 20 Z"
                        fill="url(#gradient2)"
                        opacity="0.9"
                    />
                    {/* Book spine */}
                    <path
                        d="M58 10 L62 10 L62 90 L58 90 Z"
                        fill="url(#gradient3)"
                    />
                    {/* Decorative star */}
                    <path
                        d="M60 35 L63 44 L72 44 L65 50 L68 59 L60 53 L52 59 L55 50 L48 44 L57 44 Z"
                        fill="url(#gradient4)"
                        className="star"
                    />

                    {/* Gradients */}
                    <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#667eea" />
                            <stop offset="100%" stopColor="#764ba2" />
                        </linearGradient>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f093fb" />
                            <stop offset="100%" stopColor="#f5576c" />
                        </linearGradient>
                        <linearGradient id="gradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#4facfe" />
                            <stop offset="100%" stopColor="#00f2fe" />
                        </linearGradient>
                        <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ffd89b" />
                            <stop offset="100%" stopColor="#19547b" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="loading-text">StoryVerse</div>
            </div>
        </div>
    );
}