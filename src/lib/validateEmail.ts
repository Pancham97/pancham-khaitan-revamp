export default function validateEmail(email: string): boolean {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || trimmedEmail.length > 254) {
        return false;
    }

    if (/[\s<>]/.test(trimmedEmail)) {
        return false;
    }

    const parts = trimmedEmail.split("@");
    if (parts.length !== 2) {
        return false;
    }

    const [localPart, domain] = parts;

    if (
        !localPart ||
        !domain ||
        localPart.length > 64 ||
        domain.length > 253 ||
        localPart.startsWith(".") ||
        localPart.endsWith(".") ||
        localPart.includes("..") ||
        domain.includes("..")
    ) {
        return false;
    }

    if (!/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(localPart)) {
        return false;
    }

    const labels = domain.split(".");
    if (labels.length < 2) {
        return false;
    }

    const topLevelDomain = labels[labels.length - 1];
    if (!/^[A-Za-z]{2,63}$/.test(topLevelDomain)) {
        return false;
    }

    return labels.every((label) => {
        return (
            label.length > 0 &&
            label.length <= 63 &&
            /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label)
        );
    });
}
