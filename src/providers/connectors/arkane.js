const ConnectToArkane = (Arkane, opts) => {
    return new Promise(async (resolve, reject) => {
        if (opts && opts.clientId) {
            try {
                const options = {
                    clientId: opts.clientId,
                    rpcUrl: opts.nodeUrl,
                    environment: opts.environment,
                    signMethod: "POPUP"
                };
                const provider = await window.Arkane.createArkaneProviderEngine(
                    options
                );
                return resolve(provider);
            } catch (error) {
                console.error(error);
                return reject(new Error("Failed to login to Arkane 2"));
            }
        } else {
            return reject(new Error("Please provide an Arkane client id"));
        }
    });
};

export default ConnectToArkane;