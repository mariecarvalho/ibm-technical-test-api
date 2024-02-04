import { PORT } from './config';

import app from './app';

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
