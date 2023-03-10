'use client';

import { FC } from "react";
import Avatar from "../Avatar/Avatar";
import { HiPhoto, HiVideoCamera } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { db, storage } from "@/firebase/firebase-app";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid"

type PostFormProps = {
  username: string;
  avatarUrl: string;
};

const PostForm: FC<PostFormProps> = ({ username, avatarUrl }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mediaUrl, setMediaUrl] = useState<any>(null);
  const [mediaType, setMediaType] = useState<string>("")
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    if (!inputRef.current?.value && !mediaUrl) return;

    const downloadMediaUrl = await uploadMedia();
    await addDoc(collection(db, 'posts'), {
      authorName: username,
      avatarUrl: avatarUrl,
      timestamp: serverTimestamp(),
      content: inputRef.current?.value || "",
      imageUrl: (mediaType === "image") ? downloadMediaUrl : "",
      videoUrl: (mediaType === "video") ? downloadMediaUrl : "",
      comments: 0
    });

    inputRef.current!.value = "";
    setMediaUrl(null)

    router.refresh();
  }

  const uploadMedia = async () => {
    if (mediaUrl == null) return "";

    const mediaRef = ref(storage, `posts/${mediaUrl.name + v4()}`);
    const snapshot = await uploadBytes(mediaRef, mediaUrl)
    const downloadMediaUrl = await getDownloadURL(snapshot.ref);

    return downloadMediaUrl;
  }

  const handleMediaChange = (e: any, mediaType: string) => {
    const file = e.target.files[0];
    if (!file) return;

    setMediaType(mediaType)
    setMediaUrl(file)
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className="flex flex-col flex-1 bg-[#191c21] rounded-2xl px-4 my-4">
        <div className="flex justify-between items-center mt-4">
          <Avatar imageUrl={avatarUrl} altText={username} size={8} />
          <input
            type="text"
            ref={inputRef}
            placeholder="Share your favourite Animemory now!"
            className="flex rounded-3xl py-3 px-4 mx-2 w-full focus:outline-none bg-[#212833] caret-white"
          />
        </div>

        <div className="mt-4 w-2/3">
          {mediaUrl && (
            mediaUrl.name.endsWith(".mp4") ? (
              <video src={URL.createObjectURL(mediaUrl)} controls />
            ) : (
              <img src={URL.createObjectURL(mediaUrl)} className="w-full object-contain" />
            )
          )}
        </div>

        <div className="flex items-center justify-between py-2 mt-4 mx-2 border-t border-[#212833]">
          <label htmlFor="image-input" className="flex flex-1 items-center justify-center space-x-1 text-[#fff] hover:bg-[#4e5d78] py-2 px-4 rounded-lg mt-1 mx-1 hover:cursor-pointer">
            <HiPhoto className="w-5 h-5 fill-[#3BC361]" />
            <span>Photo/Gif</span>
          </label>
          <input
            type="file"
            id="image-input"
            accept="image/*"
            onChange={(e) => {
              handleMediaChange(e, "image")
            }}
            className="hidden"
          />

          <label htmlFor="video-input" className="flex flex-1 items-center justify-center space-x-1 text-[#fff] hover:bg-[#4e5d78] py-2 px-4 rounded-lg mt-1 mx-1 hover:cursor-pointer">
            <HiVideoCamera className="w-5 h-5 fill-[#FF1D43]" />
            <span>Video</span>
          </label>
          <input
            type="file"
            id="video-input"
            accept="video/*"
            onChange={(e) => {
              handleMediaChange(e, "video")
            }}
            className="hidden"
          />

          <button type="submit" className="flex flex-1 items-center justify-center space-x-1 text-[#fff] bg-[#377dff] hover:bg-[#0e5ef1] py-2 px-4 rounded-lg mt-1 mx-1">
            <span>Share</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default PostForm;