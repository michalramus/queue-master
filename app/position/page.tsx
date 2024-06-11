import Header from "@/components/header";
import ClientRow from "./clientRow";

export default function Home() {
    return (
        <main className="pb24- min-h-screen px-10 pt-10 lg:px-24">
            <Header>Queue System</Header>
            <div className="flex flex-row flex-wrap self-start pt-10">
                <div className="w-full overflow-x-auto shadow-md sm:rounded-lg lg:w-6/12">
                    <table className="w-full text-center text-sm text-gray-400 rtl:text-right">
                        <thead className="bg-gray-700 text-xs uppercase text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Number
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <ClientRow number={1} category="abc"></ClientRow>
                            <ClientRow
                                number={2}
                                category="lkjalkjflkaj"
                            ></ClientRow>
                            <ClientRow
                                number={3}
                                category="fhiaifiasjifioasjoifjioasijf"
                            ></ClientRow>
                        </tbody>
                    </table>
                </div>
                <div className="w-6/12"></div>
            </div>
        </main>
    );
}
