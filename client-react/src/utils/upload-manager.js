export const getImageInfoFromFile = (file) => {

    const url = URL.createObjectURL(file);
    console.log(file);
    const img = document.createElement('img');

    const promise = new Promise((resolve, reject) => {
        img.onload = () => {
            // Natural size is the actual image size regardless of rendering.
            // The 'normal' `width`/`height` are for the **rendered** size.
            const width = img.naturalWidth;
            const height = img.naturalHeight;

            const info = { file, url, width, height };
            //setFileInfo(info);

            // Resolve promise
            resolve(info);
        };

        // Reject promise on error
        img.onerror = reject;
    });

    // Setting the source makes it start downloading and eventually call `onload`
    img.src = url;
    return promise;
};

export const initImageToCanvas = (id, url) => {
    const image = new Image();
    image.src = url;

    image.onload = function () {
        const canvas = document.getElementById(id);
        const ctx = canvas.getContext('2d');

        const width = image.naturalWidth;
        const height = image.naturalHeight;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        console.log('initImage', width, height);
        ctx.drawImage(image, 0, 0, width, height, 0, 0, width, height);
    };
};


export const drawImageScaled = (id, url, option = 'full') => {
    console.log(url)
    const img = new Image();
    img.src = url;
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext('2d');

    if(option === 'full') {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
        );
    }else{
        var hRatio = canvas.width / img.width;
        var vRatio = canvas.height / img.height;
        var ratio = Math.min(hRatio, vRatio);
        var centerShift_x = (canvas.width - img.width * ratio) / 2;
        var centerShift_y = (canvas.height - img.height * ratio) / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            centerShift_x,
            centerShift_y,
            img.width * ratio,
            img.height * ratio
        );
    }
};
