import fs from 'fs/promises';
import AppError from '../../../shared/errors/AppError';
import logger from 'm-node-logger';

class DownloadCSV {
    async execute(id: number) {
        const filename = `relatorio_${id}.csv`;
        const path = `CSVs/${filename}`;

        try {
            const file = await fs.open(path);
            await file.close();
            return path;
        } catch(err) {
            try {
                const file = await fs.open(`${path}.bak`);
                await file.close();

                logger.warn(`Could not find offical report for seller ${id}, but backup was found. Maybe an error happened?`);
                return `${path}.bak`;
            } catch(err) {
                throw new AppError(`There's no report available for you to download`, 404);
            }
        }
    }
}

export default function makeDownloadCSV() {
    return new DownloadCSV();
}