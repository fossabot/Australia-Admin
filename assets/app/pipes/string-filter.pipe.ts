import {Pipe,PipeTransform} from "@angular/core";

/**
 * A simple string filter, since ng2 does not yet have a filter pipe built in.
 */
@Pipe({
    name: 'stringFilter',
    pure: false
})
export class StringFilterPipe  implements PipeTransform  {

    transform(value: any[], q: string) {
        console.log(q+"\t"+value)
        if (value == null) {
            return value;
        }
        return value.filter(value => -1 < value.toLowerCase().indexOf(q.toLowerCase()));
    }
}