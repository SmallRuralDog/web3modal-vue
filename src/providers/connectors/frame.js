const ConnectToFrame = async (ethProvider) => {
    try {
        const provider = ethProvider('frame');
        provider.isFrameNative = true;
        return provider;
    } catch (err) {
        console.error(err);
    }
};

export default ConnectToFrame;