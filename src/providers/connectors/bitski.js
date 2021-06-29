const ConnectToBitski = async (
    Bitski,
    opts
) => {
    const bitski = new Bitski(opts.clientId, opts.callbackUrl, opts.extraBitskiOptions);
    await bitski.signIn();
    return bitski.getProvider(opts.extraProviderOptions);
};
export default ConnectToBitski;