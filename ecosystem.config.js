module.exports = {
    apps: [
        {
            name: "afitsant-backend",
            script: "yarn start:dev",
            cwd: "./afitsant-backend",
            watch: true,
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            },
            interpreter: "none",
        },
        {
            name: "afitsant-frontend",
            script: "yarn dev",
            cwd: "./afitsant-frontend",
            watch: true,
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            },
            interpreter: "none",
        }
    ],
};