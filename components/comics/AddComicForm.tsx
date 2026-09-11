"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import { addComic, ActionResponse } from "@/app/actions/comics";

/*
    Going to have lots of comments here. Trying to understand useActionState    
    and hooks better. Also, haven't made a form using tsx yet.
*/

/*
    useActionState requires intial state val to return on very first 
    render before user interacts with form.
*/
const initialState: ActionResponse = {
    success: false,
    message: "",
    fieldErrors: {},
};

export function AddComicForm() {
    // Controls whether dialogue is mounted on screen
    const [isOpen, setIsOpen] = useState(false);

    // useRef holds reference to native <form> DOM element without re-rendering when accessed
    const formRef = useRef<HTMLFormElement>(null);

    // Hooks the form action to Server Action
    const [state, formAction, isPending] = useActionState(addComic, initialState);

    // If insert passes, clear form fields and close
    useEffect(() => {
        if (state.success) {
            formRef.current?.reset();
            setIsOpen(false);
        }
    }, [state]);

    return(
        <>
        <button onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        >+ Add Comic</button>

        {/* Overlay */}
        {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
                {/* Card */}
                <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                        <h2 className="text-lg font-bold text-white">Add Comic To Collection</h2>
                        <button 
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-white text-lg font-bold px-2 py-1 rounded"
                        > 
                            &times; 
                        </button>
                    </div>
                    {/* Top-level error message if validation failed */}
                    {state.message && !state.success && (
                    <div className="mb-4 rounded-lg border border-red-800/50 bg-red-950/40 p-3 text-xs text-red-300">
                        {state.message}
                    </div>
                    )}

                    {/* 3. The Form */}
                    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
                    {/* Row: Title & Publisher */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            name="title"
                            type="text"
                            required
                            placeholder="e.g. Batman: The Long Halloween"
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                        />
                        {state.fieldErrors?.title && (
                            <p className="mt-1 text-xs text-red-400">{state.fieldErrors.title}</p>
                        )}
                        </div>

                        <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Publisher <span className="text-red-400">*</span>
                        </label>
                        <input
                            name="publisher"
                            type="text"
                            required
                            placeholder="e.g. DC Comics, Marvel"
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                        />
                        {state.fieldErrors?.publisher && (
                            <p className="mt-1 text-xs text-red-400">{state.fieldErrors.publisher}</p>
                        )}
                        </div>
                    </div>

                    {/* Row: Issue Number & Format */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Issue Number
                        </label>
                        <input
                            name="issue_number"
                            type="text"
                            placeholder="e.g. 1 or Special #2"
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                        />
                        </div>

                        <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Format
                        </label>
                        <select
                            name="format"
                            defaultValue="single_issue"
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                        >
                            <option value="single_issue">Single Issue</option>
                            <option value="tpb">Trade Paperback (TPB)</option>
                        </select>
                        {state.fieldErrors?.format && (
                            <p className="mt-1 text-xs text-red-400">{state.fieldErrors.format}</p>
                        )}
                        </div>
                    </div>

                    {/* Row: Main Character & Author */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Main Character
                        </label>
                        <input
                            name="main_character"
                            type="text"
                            placeholder="e.g. Spider-Man"
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                        />
                        </div>

                        <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Author / Writer
                        </label>
                        <input
                            name="author"
                            type="text"
                            placeholder="e.g. Jeph Loeb"
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                        />
                        </div>
                    </div>

                    {/* Cover Image URL */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Cover Image URL
                        </label>
                        <input
                        name="cover_img_url"
                        type="url"
                        placeholder="https://images.example.com/cover.jpg"
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                        />
                        {state.fieldErrors?.cover_img_url && (
                        <p className="mt-1 text-xs text-red-400">{state.fieldErrors.cover_img_url}</p>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Personal Notes
                        </label>
                        <textarea
                        name="notes"
                        rows={2}
                        placeholder="First print, signed copy, bag & board condition..."
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="mt-2 flex justify-end gap-3 border-t border-slate-800 pt-4">
                        <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        disabled={isPending}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
                        >
                        Cancel
                        </button>
                        <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
                        >
                        {isPending ? "Saving..." : "Save Comic"}
                        </button>
                    </div>
                    </form>
                </div>
            </div>
        )}
        </>
    );
}