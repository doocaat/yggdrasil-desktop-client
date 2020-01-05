import * as IpAddress from 'ip-address';
export const ipv4 = IpAddress.Address4;
export const ipv6 = IpAddress.Address6;


export class IpUtil {

    public static isIpV4(address: string): boolean {
        const ipV4Address = new ipv4(IpUtil.format(address));
        return ipV4Address.isValid();
    }

    public static isIpV6(address: string): boolean {
        const ipV6Address = new ipv6(IpUtil.format(address));
        return ipV6Address.isValid();
    }

    public static isIp(address: string): boolean {
        return (IpUtil.isIpV4(address) || IpUtil.isIpV6(address));
    }

    public static format(address: string): string {
        address = address.replace(/^\[|\]$/gm, '');

        return address;
    }
}
