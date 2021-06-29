// Supports Torus package versions 0.2.*
const ConnectToTorus = async (Torus, opts) => {
    return new Promise(async (resolve, reject) => {
        try {
            // defaults
            let buttonPosition = "bottom-left";
            let apiKey = "torus-default";
            let modalZIndex = 99999;
            let network = {host: "mainnet"};
            let defaultVerifier = undefined;

            // parsing to Torus interfaces
            network =
                opts.networkParams || opts.network
                    ? {host: opts.network, ...opts.networkParams}
                    : network;

            const torus = new Torus({
                buttonPosition: opts.config?.buttonPosition || buttonPosition,
                apiKey: opts.config?.apiKey || apiKey,
                modalZIndex: opts.config?.modalZIndex || modalZIndex
            });
            await torus.init({
                showTorusButton: false,
                ...opts.config,
                network
            });

            if (opts.loginParams) {
                defaultVerifier = opts.loginParams.verifier;
            }
            await torus.login({verifier: defaultVerifier});
            const provider = torus.provider;
            provider.torus = torus;
            resolve(provider);
        } catch (err) {
            reject(err);
        }
    });
};

export default ConnectToTorus;