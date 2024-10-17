import papa from 'papaparse'
import { ReportInterface } from '../types';
import fs from 'fs';
import logger from 'm-node-logger';

class ExportCSV {
    constructor(
        private readonly unparseConfig: papa.UnparseConfig,
        private readonly parseConfig: papa.ParseConfig) {}

    async execute(report: ReportInterface[], id: number) {
        const filename = `relatorio_${id}.csv`;
        const path = `CSVs/${filename}`;

        let current: ReportInterface[] = [];

        logger.info(`Generating CSV report...`);

        if(fs.existsSync(path)) {
            logger.info(`Backing up existent CSV report...`);
            fs.copyFileSync(path, `${path}.bak`);
            const content = fs.readFileSync(path);
            current = papa.parse(content.toString(), this.parseConfig).data;
        }

        current.push(...report);

        const csv = papa.unparse(current, this.unparseConfig);

        fs.writeFileSync(path, csv);

        logger.info(`CSV report exported for seller ${id}`);

        return true;
    }
}

export default function makeExportCSV() {
    return new ExportCSV({
        quotes: true,
        delimiter: ",",	// auto-detect
        newline: "\r\n",	// auto-detect
        quoteChar: '"',
        escapeChar: '"',
        header: true,
        skipEmptyLines: false,
    }, {
        delimiter: ",",	// auto-detect
        newline: "\n",	// auto-detect
        quoteChar: '"',
        escapeChar: '"',
        header: true,
        transformHeader: undefined,
        dynamicTyping: false,
        preview: 0,
        comments: false,
        step: undefined,
        complete: undefined,
        skipEmptyLines: false,
        fastMode: undefined,
        beforeFirstChunk: undefined,
        transform: undefined,
        delimitersToGuess: [',', '\t', '|', ';', papa.RECORD_SEP, papa.UNIT_SEP],
    });
}