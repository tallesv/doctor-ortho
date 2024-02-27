import { Avatar, Tooltip } from 'flowbite-react';
import { parseCookies } from 'nookies';
import { useState } from 'react';
import { HiOutlineXCircle } from 'react-icons/hi';

interface AvatarComponent {
  showTooltip: boolean;
  avatarUrl: string | undefined;
  handleRemoveAvatar: () => void;
  handleAddAvatar: (file: File) => void;
}

export function AvatarComponent({
  showTooltip,
  avatarUrl,
  handleRemoveAvatar,
  handleAddAvatar,
}: AvatarComponent) {
  const cookies = parseCookies();
  const themeSaved =
    cookies['doctor-ortho.theme'] === 'dark' ? 'dark' : 'light';

  const [avatarPreview, setAvatarPreview] = useState<string>();

  function onRemoveAvatar() {
    setAvatarPreview(undefined);
    handleRemoveAvatar();
  }

  function onAvatarUpload(file: File) {
    const imgURL = URL.createObjectURL(file);
    setAvatarPreview(imgURL);
    handleAddAvatar(file);
  }

  return (
    <div>
      {showTooltip && (
        <div className="cursor-pointer relative left-16 top-3 z-10">
          <Tooltip content="Excluir avatar" style={themeSaved}>
            <HiOutlineXCircle
              className="text-red-500 bh-white dark:bg-gray-700 rounded-full w-6 h-6"
              onClick={() => onRemoveAvatar()}
            />
          </Tooltip>
        </div>
      )}
      <label>
        <Avatar
          img={avatarPreview || avatarUrl}
          size={'lg'}
          className="cursor-pointer"
        >
          <input
            type="file"
            className="hidden"
            onChange={e => onAvatarUpload(e.target.files![0])}
          />
        </Avatar>
      </label>
    </div>
  );
}
