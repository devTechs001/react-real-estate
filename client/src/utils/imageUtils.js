export const compressImage = async (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          },
          'image/jpeg',
          quality
        );
      };
    };
  });
};

export const getImageDimensions = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
    };
  });
};

export const validateImageFile = (file, maxSize = 5 * 1024 * 1024) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload JPG, PNG or WebP' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: `File size must be less than ${maxSize / 1024 / 1024}MB` };
  }
  
  return { valid: true };
};

export const createImageThumbnail = (file, size = 200) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        const scale = Math.max(size / img.width, size / img.height);
        const x = (size - img.width * scale) / 2;
        const y = (size - img.height * scale) / 2;
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        
        canvas.toBlob((blob) => {
          resolve(URL.createObjectURL(blob));
        }, 'image/jpeg', 0.7);
      };
    };
  });
};