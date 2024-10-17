import fs from 'fs';
import AppError from '../../../shared/errors/AppError';
import logger from 'm-node-logger';

class DownloadCSV {
    async execute(id: number) {
        const filename = `relatorio_${id}.csv`;
        const path = `CSVs/${filename}`;

        if(!fs.existsSync(path)) {
            if(fs.existsSync(`${path}.bak`)) {
                logger.warn(`Could not find offical report for seller ${id}, but backup was found. Maybe an error happened?`);
                return `${path}.bak`;
            }

            throw new AppError(`There's no report available for you to download`, 404);
        }

        return path;
    }
}

export default function makeDownloadCSV() {
    return new DownloadCSV();
}