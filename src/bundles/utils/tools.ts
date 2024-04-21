export class ProcessDate {
    protected date: string

    public constructor(date: string) {
        this.date = date
    }
    public encode(): string {
        return this.process(this.date, 'encode')
    }
    public decode(): string {
        return this.process(this.date, 'decode')
    }
    private process(date: string, type: 'encode' | 'decode'): string {
        const separator: string = type === 'decode' ? '-' : '/'
        const new_separator: string = type === 'decode' ? '/' : '-'

        const content: string[] = date.split(separator)
        return content.reverse().join(new_separator)
    }
}