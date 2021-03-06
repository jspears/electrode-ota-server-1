import diregister from "electrode-ota-server-diregister";
import assert from 'assert';
/**
 * The fileservice is meant to be plugable.
 *
 * By default we stick it into cassandra.  This is less than optimal,
 * but will work for some circumstances. You would probable want to
 * use a storage provider for this stuff.
 *
 */

export const fileservice = (options, dao) => {
    return (packageHash, url, type) => {
        const hash = packageHash
            || url.split('/').pop();
        const p = dao.download(hash);

        if (type == 'application/json') {
            p.then((resp) => {
                return JSON.parse(resp + '')
            });
        }
        return p;
    };
};
export const register = diregister({
    name: "ota!fileservice-download",
    multiple: false,
    connections: false,
    dependencies: ['ota!dao']
}, fileservice);

