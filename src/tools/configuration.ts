import * as vscode from 'vscode';

export async function prepareConfiguration(section: string, key: string, placeHolder: string) {
    if (!vscode.workspace.getConfiguration(section).get(key)) {
        vscode.window.showInputBox({ placeHolder: placeHolder })
            .then((token) => {
                if (!token) {
                    vscode.window.showErrorMessage(placeHolder + ' cannot be empty');
                    return;
                }

                vscode.workspace.getConfiguration(section).update(key, token, true);
            });
    }
}