import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import default_image from '../Assets/default_image.svg';


const ImageGenerator = () => {
    const [image_url, setImage_url] = useState(default_image); // Set default image initially
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const imageGenerator = async () => {
        if (inputRef.current.value === "") {
            return;
        }
        setLoading(true);
        try {
            const response = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer //put here your api-key`,
                    "User-Agent": "Chrome",
                },
                body: JSON.stringify({
                    prompt: `${inputRef.current.value}`,
                    n: 1,
                    size: "512x512",
                }),
            });

            const data = await response.json();
            if (data && data.data && data.data.length > 0 && data.data[0].url) {
                setImage_url(data.data[0].url);
            } else {
                setImage_url(default_image);
                console.error("Unexpected data format:", data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setImage_url(default_image);
        }
        setLoading(false);
    };

    return (
        <div className='ai-image-generator'>
            <div className="header">Ai image <span>generator</span></div>
            <div className="img-loading">
                <div className="image">
                    <img src={image_url === '/' ? default_image : image_url} alt="" /> {/* Use image_url directly */}
                    <div className="loading">
                        <div className={loading ? "loading-bar-full" : "loading-bar"}>
                            <div className={loading ? "loading-text" : "display-none"}> Loading ....</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="search-box">
                <input type="text" ref={inputRef} className="search-input" placeholder='Describe about your image' />
                <div className="generate-btn" onClick={imageGenerator}>Generate</div>
            </div>
        </div>
    );
}

export default ImageGenerator;
