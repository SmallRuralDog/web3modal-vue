const ConnectToFortmatic = async (Fortmatic, opts) => {
    if (opts && opts.key) {
        try {
            const key = opts.key;
            const fm = new Fortmatic(key, opts.network);
            const provider = await fm.getProvider();
            provider.fm = fm;
            await fm.user.login();
            const isLoggedIn = await fm.user.isLoggedIn();
            if (isLoggedIn) {
                return provider;
            } else {
                throw new Error("Failed to login to Fortmatic");
            }
        } catch (error) {
            console.error(error)
        }
    } else {
        throw new Error("Missing Fortmatic key");
    }
};

export default ConnectToFortmatic;