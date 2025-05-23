import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const folder = path.join(__dirname, 'public');
const widths = [355, 852, 1278, 1680, 2000, 2268];

let totalGenerated = 0;
let totalSkipped = 0;

const files = fs.readdirSync(folder);

for (const file of files) {
    const ext = path.extname(file).toLowerCase();

    if (ext === '.avif' && !/-\d+w\.avif$/.test(file)) {
        const baseName = path.basename(file, ext);
        const inputPath = path.join(folder, file);

        for (const width of widths) {
            const outputFile = `${baseName}-${width}w.avif`;
            const outputPath = path.join(folder, outputFile);

            if (fs.existsSync(outputPath)) {
                console.log(`⚠️  Ya existe: ${outputFile} — omitido`);
                totalSkipped++;
                continue;
            }

            try {
                await sharp(inputPath)
                    .resize({ width })
                    .toFormat('avif')
                    .toFile(outputPath);
                console.log(`✔️  Generado: ${outputFile}`);
                totalGenerated++;
            } catch (err) {
                console.error(`❌ Error procesando ${file} (${width}px):`, err.message);
            }
        }
    }
}

console.log('\n📊 RESUMEN FINAL');
console.log(`🟢 Imágenes generadas: ${totalGenerated}`);
console.log(`🟡 Imágenes omitidas:  ${totalSkipped}`);
