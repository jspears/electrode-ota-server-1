import diregister from "electrode-ota-server-diregister";
import {shasum} from 'electrode-ota-server-util';
/**
 * The fileservice is meant to be plugable.
 *
 * By default we stick it into cassandra.  This is less than optimal,
 * but will work for some circumstances. You would probable want to
 * use a storage provider for this stuff.
 *
 */
export const fileservice = (options, downloadUrl, dao) => {
    downloadUrl = downloadUrl && downloadUrl.replace(/\/+?$/, '');
    if (!downloadUrl){
        console.warn(`Please configure a downloadUrl pointing to your server in plugins.electrode-ota-server-fileserver.options.downloadUrl`);
    }
    return (file) => {
        const packageHash = shasum(file);
        return dao.upload(packageHash, file).then(() => ({
            packageHash,
            size: file.length,
            blobUrl: downloadUrl ? `${downloadUrl}/${packageHash}` : packageHash
        }), (err) => {
            console.log('upload error', err);
            throw err;
        });
    };
};

export const register = diregister({
    name: "ota!fileservice-upload",
    multiple: false,
    connections: false,
    dependencies: ['ota!fileservice', 'ota!dao']
}, fileservice);

